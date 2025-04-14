import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children, className, ...rest }: UTILS.INavLink) {
    const pathname = usePathname();
    const cleanPath = (url: string) => url.replace(/\/+$/, '');

    const isActive = cleanPath(pathname || '') === cleanPath(href);

    return (
        <Link href={href} className={`${className} ${isActive ? 'active' : ''}`} {...rest}>
            {children}
        </Link >
    )
}
