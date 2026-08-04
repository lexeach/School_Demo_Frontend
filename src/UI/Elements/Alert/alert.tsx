import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function UIAlert({
  title = 'No Database Found',
  description = 'No Database Added for this DataSource',
}) {
  return (
    <Alert variant="destructive">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
