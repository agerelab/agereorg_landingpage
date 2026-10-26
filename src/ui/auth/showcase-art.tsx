// App marks for the App Center mock-up (D121, now shared with the public site through
// features/brand-marks.tsx). Fixed colours here are the UI-01 exception for the providers' own logos
// (shapes from Simple Icons, CC0, and Supericons; colours from the brand guides).

type Mark = { className?: string };

export function GoogleDriveMark({ className }: Mark) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path fill="#FBBC04" d="M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574z" />
      <path fill="#34A853" d="M7.25 3.215a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214z" />
      <path fill="#4285F4" d="M9.509 15.868l-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z" />
    </svg>
  );
}

/** GitHub's mark is one colour; it follows the text colour so it reads in both themes. */
export function GitHubMark({ className }: Mark) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function SlackMark({ className }: Mark) {
  return (
    <svg viewBox="0 0 54 54" aria-hidden className={className}>
      <path fill="#E01E5A" d="M11.379 34a5.651 5.651 0 1 1-5.651-5.652h5.651z" />
      <path fill="#E01E5A" d="M14.196 34a5.651 5.651 0 0 1 11.303 0v14.135a5.651 5.651 0 0 1-11.303 0z" />
      <path fill="#36C5F0" d="M19.866 11.267a5.651 5.651 0 1 1 5.652-5.651v5.651z" />
      <path fill="#36C5F0" d="M19.868 14.133a5.651 5.651 0 0 1 0 11.303H5.676a5.651 5.651 0 0 1 0-11.303z" />
      <path fill="#2EB67D" d="M42.532 19.785a5.651 5.651 0 1 1 5.652 5.652h-5.652z" />
      <path fill="#2EB67D" d="M39.713 19.793a5.651 5.651 0 0 1-11.303 0V5.62a5.651 5.651 0 0 1 11.303 0z" />
      <path fill="#ECB22E" d="M34.038 42.482a5.651 5.651 0 1 1-5.651 5.651v-5.651z" />
      <path fill="#ECB22E" d="M34.038 39.651a5.651 5.651 0 0 1 0-11.303h14.193a5.651 5.651 0 0 1 0 11.303z" />
    </svg>
  );
}

/** Zendesk's mark is one colour (its brand teal is near-black); it follows the text colour like GitHub. */
export function ZendeskMark({ className }: Mark) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12.914 2.904V16.29L24 2.905H12.914zM0 2.906C0 5.966 2.483 8.45 5.543 8.45s5.542-2.484 5.543-5.544H0zm11.086 4.807L0 21.096h11.086V7.713zm7.37 7.84c-3.063 0-5.542 2.48-5.542 5.543H24c0-3.06-2.48-5.543-5.543-5.543z" />
    </svg>
  );
}
