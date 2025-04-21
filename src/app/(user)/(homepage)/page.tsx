import { IVendor } from "@models/vendor/common.model";
import { IVendorsResponse } from "@models/vendor/response.model";
import HomePage from "@pages/Public/HomePage";
import vendorService from "@services/vendors";

async function getVendors() {
  return await vendorService.getVendors()
}

export default async function Home() {
  const vendors = await getVendors() as IVendorsResponse;
  const vendorsData = vendors?.data?.data as IVendor[];
  return (
    <>
      <HomePage vendors={vendorsData} />
    </>
  );
}