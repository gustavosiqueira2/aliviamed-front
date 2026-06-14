import { Fragment, useEffect, useRef } from 'react';

import { createPortal } from 'react-dom';

import { Eye, Lock, ShieldCheck, X } from 'lucide-react';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Divider,
  Empty,
  Form,
  Spin,
  theme,
  Typography,
} from 'antd';

import { useWidthBreakpoint } from '@hooks/useWidthBreakpoint';

import { renderFormInput } from '@pages/Forms/NewForm/components/renderFormInput';
import type { TInput } from '@pages/Forms/NewForm/NewForm';

const { Title, Paragraph, Text } = Typography;

export type TFormPreviewGroup = {
  id: string;
  title: string;
  inputs: TInput[];
};

type TFormCardProps = {
  border?: boolean;
  clinicName?: string;
  groups: TFormPreviewGroup[];
};

const FormCard: React.FC<TFormCardProps> = (props) => {
  const { border, clinicName, groups } = props;

  const {
    token: { colorFillTertiary },
  } = theme.useToken();

  const isEmpty =
    groups.length === 0 || groups.every((group) => group.inputs.length === 0);

  return (
    <Card variant={border ? 'outlined' : 'borderless'}>
      {clinicName && (
        <div className="mb-4 text-center">
          <Title level={3} className="mb-0!">
            {clinicName}
          </Title>
        </div>
      )}

      {isEmpty ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="O formulário ainda não tem campos para pré-visualizar."
        />
      ) : (
        <Form layout="vertical">
          {groups.map((group, index) => (
            <Fragment key={group.id}>
              <Divider
                titlePlacement="start"
                className={index === 0 ? 'mt-0!' : undefined}
              >
                <Title level={5} className="mb-0!">
                  {group.title}
                </Title>
              </Divider>

              {group.inputs.length === 0 ? (
                <Paragraph type="secondary" className="mb-0!">
                  Nenhum campo neste grupo.
                </Paragraph>
              ) : (
                group.inputs.map((input) => (
                  <Form.Item
                    key={input.name}
                    label={input.label}
                    required={input.required}
                    className="mb-3!"
                  >
                    {renderFormInput(input)}
                  </Form.Item>
                ))
              )}
            </Fragment>
          ))}

          <Divider className="mt-2!" />

          <Form.Item
            name="lgpdConsent"
            valuePropName="checked"
            rules={[{ required: true }]}
            className="mb-4!"
          >
            <Checkbox>
              Li e concordo com o tratamento dos meus dados pessoais e dos meus
              dados sensíveis de saúde para fins de atendimento e acompanhamento
              clínico, conforme a Lei Geral de Proteção de Dados (LGPD — Lei nº
              13.709/2018).
            </Checkbox>
          </Form.Item>

          <Button type="primary" size="large" block disabled>
            Enviar respostas
          </Button>

          <div
            className="mt-6 flex flex-col gap-2 rounded-lg p-4"
            style={{ background: colorFillTertiary }}
          >
            <div className="flex items-start gap-2">
              <ShieldCheck
                size={16}
                className="mt-0.5 shrink-0 text-green-600"
              />
              <Text type="secondary" className="text-xs!">
                Seus dados são armazenados de forma segura e criptografada e
                utilizados exclusivamente para fins de atendimento e
                acompanhamento clínico.
              </Text>
            </div>

            <div className="flex items-start gap-2">
              <Lock size={16} className="mt-0.5 shrink-0 text-gray-500" />
              <Text type="secondary" className="text-xs!">
                Em conformidade com a LGPD, você pode solicitar acesso, correção
                ou exclusão dos seus dados a qualquer momento entrando em
                contato com a clínica.
              </Text>
            </div>

            <Text type="secondary" className="mt-1 text-center text-xs!">
              {clinicName ? `${clinicName} — ` : ''}responsável pelo tratamento
              dos dados (controladora).
            </Text>
          </div>
        </Form>
      )}
    </Card>
  );
};

type TFormPreviewProps = {
  open: boolean;
  onClose: () => void;
  clinicName?: string;
  groups: TFormPreviewGroup[];
  loading?: boolean;
};

const FormPreview: React.FC<TFormPreviewProps> = (props) => {
  const { open, onClose, clinicName, groups, loading } = props;

  const {
    token: { colorBgContainer, colorBgBase },
  } = theme.useToken();

  const isDesktop = !useWidthBreakpoint(1100);

  const normalRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const isSyncing = useRef(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  const syncScroll =
    (
      sourceRef: React.RefObject<HTMLDivElement | null>,
      targetRef: React.RefObject<HTMLDivElement | null>,
    ) =>
    () => {
      if (isSyncing.current) return;

      const source = sourceRef.current;
      const target = targetRef.current;
      if (!source || !target) return;

      isSyncing.current = true;

      const max = source.scrollHeight - source.clientHeight;
      const ratio = max > 0 ? source.scrollTop / max : 0;
      target.scrollTop = ratio * (target.scrollHeight - target.clientHeight);

      requestAnimationFrame(() => {
        isSyncing.current = false;
      });
    };

  if (!open) return null;

  const normalContent = (
    <div className="flex flex-col gap-4 p-4 py-4! sm:p-12 md:p-24">
      <Alert
        type="info"
        showIcon
        icon={<Eye size={16} />}
        title="Pré-visualização — é assim que o paciente verá o formulário."
      />

      <FormCard border clinicName={clinicName} groups={groups} />
    </div>
  );

  const content = !isDesktop ? (
    <div
      ref={normalRef}
      onScroll={syncScroll(normalRef, phoneRef)}
      className="no-scrollbar h-full overflow-auto"
      style={{ background: colorBgContainer }}
    >
      {normalContent}
    </div>
  ) : (
    <div
      className="flex h-full"
      style={{
        backgroundColor: colorBgBase,
        backgroundImage: `
radial-gradient(#8b5cf640 2px, transparent 2px), radial-gradient(#8b5cf620 2px, ${colorBgBase} 2px)
            `,
        backgroundSize: '80px 80px',
        backgroundPosition: '0 0,40px 40px',
      }}
    >
      <div
        ref={normalRef}
        onScroll={syncScroll(normalRef, phoneRef)}
        className="no-scrollbar h-full flex-2 overflow-auto"
      >
        {normalContent}
      </div>

      <div className="flex h-full flex-1 items-center justify-center">
        <div className="relative h-[85vh] max-h-205 w-97.5 shrink-0 overflow-hidden rounded-[3rem] border-8 border-black bg-black shadow-2xl">
          <div className="pointer-events-none absolute top-3 left-1/2 z-20 h-2 w-28 -translate-x-1/2 rounded-full bg-black" />

          <div
            ref={phoneRef}
            onScroll={syncScroll(phoneRef, normalRef)}
            className="no-scrollbar h-full w-full overflow-auto pt-3"
            style={{ background: colorBgContainer }}
          >
            <FormCard clinicName={clinicName} groups={groups} />
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(
    <div
      className="fixed inset-0 z-1000 overflow-hidden"
      style={{ background: colorBgContainer }}
    >
      <div className="absolute top-4 right-4 z-50">
        <Button
          shape="circle"
          size="large"
          icon={<X size={16} />}
          onClick={onClose}
          aria-label="Fechar pré-visualização"
          className="shadow-md"
        />
      </div>

      {loading ? (
        <div className="flex h-full items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        content
      )}
    </div>,
    document.body,
  );
};

export default FormPreview;
