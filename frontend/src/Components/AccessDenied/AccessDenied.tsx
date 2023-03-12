type AccessDeniedProps = {
  className?: string;
};

export function AccessDenied({ className }: AccessDeniedProps) {
  return <div className={className}>Forbidden! You do not have permission to perform this.</div>;
}
