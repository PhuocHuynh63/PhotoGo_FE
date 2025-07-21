import { ROUTES } from "@routes";
import { redirect } from "next/navigation";

export default async function Subscription() {
    redirect(ROUTES.PUBLIC.SUBSCRIPTION.MEMBERSHIP)
}