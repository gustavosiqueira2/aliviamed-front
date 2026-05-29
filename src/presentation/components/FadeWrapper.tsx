import { forwardRef } from 'react';

import { motion } from 'framer-motion';

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

type TFadeWrapperProps = {
  children: React.ReactNode;
  className?: string;
  duration?: number;
};

const FadeWrapper = forwardRef<HTMLDivElement, TFadeWrapperProps>(
  (props, ref) => {
    const { children, className, duration = 0.35 } = props;

    return (
      <motion.div
        ref={ref}
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration }}
        className={'h-full ' + className}
      >
        {children}
      </motion.div>
    );
  },
);

export default FadeWrapper;
