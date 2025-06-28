import { useEffect, useState } from 'react';

export function useVietnamAddress() {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch provinces
  useEffect(() => {
    setLoading(true);
    fetch('https://provinces.open-api.vn/api/p/')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(error => {
        console.error('Error fetching provinces:', error);
        setError('Failed to fetch provinces.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch districts based on province code
  const fetchDistricts = (provinceCode: string) => {
    setLoading(true);
    setDistricts([]); // Reset districts when new province is selected
    setWards([]); // Reset wards when new province is selected
    fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      .then(res => res.json())
      .then(data => setDistricts(data.districts || []))
      .catch(error => {
        console.error('Error fetching districts:', error);
        setError('Failed to fetch districts.');
      })
      .finally(() => setLoading(false));
  };

  // Fetch wards based on district code
  const fetchWards = (districtCode: string) => {
    setLoading(true);
    setWards([]); // Reset wards when new district is selected
    fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then(res => res.json())
      .then(data => setWards(data.wards || []))
      .catch(error => {
        console.error('Error fetching wards:', error);
        setError('Failed to fetch wards.');
      })
      .finally(() => setLoading(false));
  };

  return {
    provinces,
    districts,
    wards,
    loading,
    error,
    fetchDistricts,
    fetchWards,
  };
}