import { IVendorResponse } from "@models/vendor/response.model";
import HomePage from "@pages/Public/HomePage";
import vendorService from "@services/vendors";

async function getVendors() {
  return await vendorService.getVendors()
}

export default async function Home() {
  const vendors = await getVendors() as IVendorResponse;
  if (!vendors.data) {
    return null;
  }
  return (
    <>
      <HomePage data={vendors.data} />
    </>
  );
}