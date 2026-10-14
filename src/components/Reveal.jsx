import { useReveal } from '../hooks';

/** Wrapper that applies the `.reveal` scroll-in behaviour to any element. */
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const [ref, armed] = useReveal();
  return (
    <Tag ref={ref} className={`${className} reveal${armed ? ' arm' : ''}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
