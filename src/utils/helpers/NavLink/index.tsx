import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function NavLink({ href, children, className, ...rest }: UTILS.INavLink) {
    const pathname = usePathname();
    const cleanPath = (url: string) => url.replace(/\/+$/, '');

    const hrefPathOnly = useMemo(() => {
        return cleanPath(href.split('?')[0] || '');
    }, [href]);

    const isActive = cleanPath(pathname || '') === hrefPathOnly;

    return (
        <Link href={href} className={`${className} ${isActive ? 'active' : ''}`} {...rest}>
            {children}
        </Link >
    )
}
