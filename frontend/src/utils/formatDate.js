
export function formatReviewDate(dateString) {
  const createdDate = new Date(dateString);
  const now = new Date();
  const diffInMs = now - createdDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 1) return 'Today';
  if (diffInDays < 15) return `${diffInDays} days ago`;

  // Format as DD-MM-YYYY
  const day = String(createdDate.getDate()).padStart(2, '0');
  const month = String(createdDate.getMonth() + 1).padStart(2, '0');
  const year = createdDate.getFullYear();
  return `${day}-${month}-${year}`;
}
