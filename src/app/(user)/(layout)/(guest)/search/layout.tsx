import Chatbot from "@components/Molecules/Chatbot";
import SearchLayoutClient from "@components/Templates/SearchLayout";

export default function SearchLayout({ children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <SearchLayoutClient>
            {children}
            <Chatbot />
        </SearchLayoutClient >
    );
}
