import { useSearchParams } from 'react-router-dom';

export function useURLPosition() {
  // log lat & lng from URL
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  return { lat, lng, setSearchParams };
}
