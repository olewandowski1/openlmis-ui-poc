import { cn } from '@/lib/utils';

type TypographyProps = {
  children: React.ReactNode;
  className?: string;
};

const typographyOptions = {
  H1: ({ children, className }: TypographyProps) => (
    <h1
      className={cn(
        'text-2xl font-extrabold tracking-tight scroll-m-20 lg:text-3xl',
        className
      )}
    >
      {children}
    </h1>
  ),

  H2: ({ children, className }: TypographyProps) => (
    <h2
      className={cn(
        'pb-2 text-3xl font-semibold tracking-tight border-b scroll-m-20 first:mt-0',
        className
      )}
    >
      {children}
    </h2>
  ),

  H3: ({ children, className }: TypographyProps) => (
    <h3
      className={cn(
        'text-2xl font-semibold tracking-tight scroll-m-20',
        className
      )}
    >
      {children}
    </h3>
  ),

  H4: ({ children, className }: TypographyProps) => (
    <h4
      className={cn(
        'text-xl font-semibold tracking-tight scroll-m-20',
        className
      )}
    >
      {children}
    </h4>
  ),

  P: ({ children, className }: TypographyProps) => (
    <p className={cn('leading-7 text-base font-normal', className)}>
      {children}
    </p>
  ),

  Blockquote: ({ children, className }: TypographyProps) => (
    <blockquote className={cn('pl-6 mt-6 italic border-l-2', className)}>
      {children}
    </blockquote>
  ),

  InlineCode: ({ children, className }: TypographyProps) => (
    <code
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        className
      )}
    >
      {children}
    </code>
  ),

  Lead: ({ children, className }: TypographyProps) => (
    <p className={cn('text-xl text-muted-foreground', className)}>{children}</p>
  ),

  Large: ({ children, className }: TypographyProps) => (
    <div className={cn('text-lg font-semibold', className)}>{children}</div>
  ),

  Small: ({ children, className }: TypographyProps) => (
    <small className={cn('text-sm font-medium leading-none', className)}>
      {children}
    </small>
  ),

  Muted: ({ children, className }: TypographyProps) => (
    <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
  ),
} as const;

export const Typography: typeof typographyOptions = typographyOptions;
