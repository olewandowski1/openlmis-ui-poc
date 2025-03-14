type RootLayoutProps = {
  children: React.ReactNode;
};

/**
 * @name RootLayout
 *
 * @description
 * A layout component that wraps the entire application. It is used to provide
 * a consistent layout across all pages.
 */
export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return <div className='antialiased'>{children}</div>;
};
