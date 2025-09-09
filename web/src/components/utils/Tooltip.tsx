import { flip, FloatingPortal, offset, shift, useFloating, useTransitionStyles } from '@floating-ui/react';
import React, { useEffect, useMemo } from 'react';
import { useAppSelector } from '../../store';
import SlotTooltip from '../inventory/SlotTooltip';

const Tooltip: React.FC = () => {
  const hoverData = useAppSelector((state) => state.tooltip);

  const { refs, context, floatingStyles } = useFloating({
    middleware: [flip(), shift(), offset({ mainAxis: 10, crossAxis: 10 })],
    open: hoverData.open,
    placement: 'right-start',
  });

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 250,
    initial: {
      opacity: 0,
      clipPath: 'inset(0 100% 0 100%)',
    },
    open: {
      opacity: 1,
      clipPath: 'inset(0 0 0 0)',
    },
    close: {
      opacity: 0,
      clipPath: 'inset(0 100% 0 100%)',
    },
  });

  const mergedStyles = useMemo(() => {
    const t1 = (floatingStyles as any).transform;
    const t2 = (transitionStyles as any).transform;

    return {
      ...floatingStyles,
      ...transitionStyles,
      transform: [t1, t2].filter(Boolean).join(' '),
      willChange: 'transform, opacity, clip-path',
      borderRadius: '10px',
      overflow: 'hidden',
    } as React.CSSProperties;
  }, [floatingStyles, transitionStyles]);

  const handleMouseMove = ({ clientX, clientY }: MouseEvent | React.MouseEvent<unknown, MouseEvent>) => {
    refs.setPositionReference({
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x: clientX,
          y: clientY,
          left: clientX,
          top: clientY,
          right: clientX,
          bottom: clientY,
        };
      },
    });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {isMounted && hoverData.item && hoverData.inventoryType && (
        <FloatingPortal>
          <SlotTooltip
            ref={refs.setFloating}
            style={mergedStyles}
            item={hoverData.item!}
            inventoryType={hoverData.inventoryType!}
          />
        </FloatingPortal>
      )}
    </>
  );
};

export default Tooltip;
