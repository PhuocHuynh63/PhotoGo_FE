declare namespace ICOMPONENTS {
    // Common base props for reusable styles
    interface BaseProps {
        width?: string | number;
        height?: string | number;
        fontSize?: string | number;
    }

    // Icon-related props
    interface IconProps {
        icon?: keyof typeof import('lucide-react');
        iconSize?: number;
        iconColor?: string;
    }

    // DataTable types
    export type SortableRecord = Record<string, string | number | Date>;

    export interface DataTableProps<T extends { id: string | number } & SortableRecord> {
        data: T[];
        columns: {
            key: string;
            header: string;
            render?: (item: T) => React.ReactNode;
            sortable?: boolean;
            width?: string | number;
        }[];
        itemsPerPage?: number;
        caption?: string;
        loading?: boolean;
        onRowClick?: (row: T) => void;
        selectableRows?: boolean;
        onSelectionChange?: (selectedIds: (string | number)[]) => void;
        height?: number | string;
        width?: number | string;
        searchable?: boolean;
        searchPlaceholder?: string;
        searchBy?: string[];
        searchPosition?: 'left' | 'right';
        searchWidth?: number | string;
    }

    export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, BaseProps, IconProps {
        iconPosition?: 'left' | 'right';
        isLoading?: boolean;
        loadingText?: string;
        spinIcon?: boolean;
        className?: string;
        variant?: string;
        onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
        ref?: React.RefObject<HTMLButtonElement>;
    }

    export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, BaseProps, IconProps {
        placeholder?: string;
        togglePassword?: boolean;
        leftIconColor?: string;
        rightIconColor?: string;
    }

    export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement>, BaseProps {
        htmlFor?: string;
    }

    export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, BaseProps {
        label?: string | number;
        labelClassName?: string;
        options: SelectOption[];
        icon?: string;
        placeHolder?: string;
        value?: string | number;
        selectIcon?: string;
        className?: string;
        style?: React.CSSProperties;
        placeHolder?: string;
        onValueChange?: (value: string) => void;
    }

    export interface LucideIconProps extends IconProps {
        name: keyof typeof import('lucide-react');
        className?: string;
        spin?: boolean;
        fill?: string;
    }

    export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, BaseProps {
        placeholder?: string;
        resize?: "none" | "horizontal" | "vertical" | "both";
        maxLength?: number;
        minLength?: number;
    }

    export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
        label?: string;
        checked?: boolean;
        direction?: "vertical" | "horizontal";
        onChange?: (event: React.ChangeEvent<HTMLInputElement>, key: string) => void;
        options?: { key: string }[];
        value?: string[] | number[] | boolean[] | boolean;
        mode?: "single" | "multiple";
        groupValues?: string | number | boolean;
        onGroupChange?: (value: string | number | boolean) => void;
    }

    export interface Option {
        label: string | React.ReactNode;
        value: string;
    }

    export interface RadioButtonGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
        name: string;
        options: Option[];
        value: string;
        onChange: (value: string) => void;
    }

    export interface CardBaseProps extends React.HTMLAttributes<HTMLDivElement>, BaseProps { }

    export interface CircularProgressProps extends React.SVGProps<SVGSVGElement> {
        size?: number;
        strokeWidth?: number;
        value: number;
        color?: string;
        bgColor?: string;
        direction?: 'clockwise' | 'counter-clockwise';
        showPercentage?: boolean;
        textColor?: string;
    }

    export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>, BaseProps {
        value: number;
        backgroundColor?: string;
        color?: string;
        className?: string;
    }

    export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement>, BaseProps {
        borderRadius?: string | number;
        backgroundColor?: string;
        className?: string;
        count?: number;
        animated?: boolean;
    }

    export interface PaginationProps {
        className?: string;
        total: number;
        current: number;
        onChange: (page: number) => void;
    }

    export interface PaginationLinkProps extends React.ComponentProps<"a"> {
        isActive?: boolean;
        fontSize?: ButtonProps["fontSize"];
    }

    export interface PaginationItemProps extends React.ComponentProps<"li"> {
        className?: string;
    }

    export interface PaginationContentProps extends React.ComponentProps<"ul"> {
        className?: string;
    }

    export interface PaginationEllipsisProps extends React.ComponentProps<"span"> {
        className?: string;
    }

    export interface NavigationButtonProps extends React.ComponentProps<"a"> {
        className?: string;
        disabled?: boolean;
    }
    interface TransitionWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
        children: React.ReactNode;
        initial?: MotionProps["initial"]; // Tùy chỉnh trạng thái ban đầu
        animate?: MotionProps["animate"]; // Tùy chỉnh trạng thái khi hiển thị
        exit?: MotionProps["exit"]; // Tùy chỉnh trạng thái khi thoát
        transition?: MotionProps["transition"]; // Tùy chỉnh thời gian và kiểu hiệu ứng
        mode?: "sync" | "wait" | "popLayout"; // Tùy chỉnh mode của AnimatePresence
    }

    export interface OTPInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
        length?: number
        error?: boolean
        onChange: (otp: string) => void
    }

    export interface ISearchResult {
        id: string | number;
        title: string;
        subtitle?: string;
        image?: string;
    }

    export interface ISearch {
        placeholder?: string;
        value?: string;
        onChange?: (value: string) => void;
        onSearch?: (value: string) => void;
        className?: string;
        debounceTime?: number;
        results?: ISearchResult[];
        isLoading?: boolean;
        onResultClick?: (result: ISearchResult) => void;
        noResultsMessage?: string;
    }

    export interface SearchProps {
        placeholder?: string;
        value?: string;
        onChange?: (value: string) => void;
        onSearch?: (value: string) => void;
        className?: string;
        debounceTime?: number;
        totalResults?: number;
        searchWidth?: string;
    }

    interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
        size?: number
        src?: string
        alt?: string
        fallback?: string
        className?: string
    }

    interface AvatarImageProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {
        src: string;
        alt: string;
        className?: string;
        alt?: string;
    }

    interface AvatarFallbackProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
        children: React.ReactNode;
        className?: string;
    }

    export interface CarouselItem {
        id: number | string;
        image?: string;
        title?: string;
        description?: string;
        [key: string]: string | number | undefined;
    }

    export interface CarouselProps {
        items: CarouselItem[];
        renderItem?: (item: CarouselItem) => React.ReactNode;
        autoScroll?: boolean;
        scrollInterval?: number;
        scrollSpeed?: number;
        width?: number | string;
        height?: number | string;
        showNavigation?: boolean;
    }

    export interface AdminStaffHeaderProps {
        userRole: 'admin' | 'staff'
        userName?: string
        userAvatar?: string
    }

    export interface SidebarItem {
        title: string
        path?: string
        icon?: keyof typeof import('lucide-react')
        children?: SidebarItem[]
        isExpanded?: boolean
    }

    export interface SidebarProps {
        items: SidebarItem[]
        isCollapsed: boolean
        toggleCollapse: () => void
    }
    export interface ChartTooltipProps {
        active?: boolean
        payload?: Array<any>
        label?: string
        className?: string
        formatter?: (value: number, name: string) => React.ReactNode
    }

    export interface ChartLegendItemProps {
        color: string
        label: string
        value?: string | number
    }

    export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
        children: React.ReactNode
    }

    interface ChartDataPoint {
        name: string
        [key: string]: string | number
    }

    export interface LineChartProps {
        data: LineChartDataPoint[]
        lines: {
            dataKey: string
            stroke: string
            name?: string
        }[]
        height?: number | string
        xAxisDataKey?: string
        showGrid?: boolean
        showLegend?: boolean
        tooltipFormatter?: (value: number, name: string) => React.ReactNode
    }

    export interface BarChartProps {
        data: BarChartDataPoint[]
        bars: {
            dataKey: string
            fill: string
            name?: string
        }[]
        height?: number | string
        xAxisDataKey?: string
        showGrid?: boolean
        showLegend?: boolean
        layout?: "vertical" | "horizontal"
        tooltipFormatter?: (value: number, name: string) => React.ReactNode
    }

    export interface DataChartProps {
        data: BarChartDataPoint[]
        title?: string
        description?: string
        className?: string
    }

    type StatsCardProps = {
        title: string
        value: string | number
        icon?: ReactNode
        iconClassName?: string
        description?: string
        subtitle?: string
        trend?: "up" | "down" | "neutral"
        trendValue?: string
        change?: string
        changeIcon?: ReactNode
        changeColor?: string
        layout?: "header" | "side"
        className?: string
    };

    type UserRank = "unranked" | "bronze" | "silver" | "gold"

    interface RankFrameProps extends React.HTMLAttributes<HTMLDivElement> {
        rank: UserRank
        className?: string
        showLabel?: boolean
        size?: "sm" | "md" | "lg"
        children?: React.ReactNode
        onClick?: () => void
    }

    type Notification = {
        id: string | number;
        title: string;
        description: string;
        read: boolean;
        createdAt: string;
    }

    interface ServiceConcept {
        id: string,
        servicePackageId: string,
        name: string,
        description: string,
        price: string,
        duration: number,
        status: string,
        createdAt: string,
        updatedAt: string
    }
    interface CartItem {
        id: string,
        cartId: string,
        serviceConceptId: string,
        created_at: string,
        updated_at: string,
        serviceConcept: ServiceConcept
    }
    interface VendorGroup {
        vendor_id: string
        items: CartItem[]
    }

    interface ShoppingCartModalProps {
        isOpen: boolean
        onClose: () => void
        cartItems: CartItem[]
    }
    interface User {
        id: string | number;
        name: string;
        email: string;
        avatar: string;
        rank: UserRank;
        cart: CartItem[];
        notifications: Notification[];
    }
    interface AutoScrollItem {
        id: string | number;
        name?: string;
        avatar?: string;
        star?: number;
        comment?: string;
    }
    type PropType = {
        slides: AutoScrollItem[]
        options?: EmblaOptionsType
        autoScroll?: boolean
        showControls?: boolean
    }

    interface ServiceType {
        key: string | number
    }
    interface VendorType {
        key: string | number
    }
    interface AddressType {
        key: string
    }



    interface ServiceCard {
        id: number
        name: string
        type: string[]
        district: string
        city: string
        rating: number
        reviewCount: number
        priceRange: [number, number]
        categories: string[]
        image: string
        available: boolean
        featured: boolean
        available_dates: string[]
    }

    interface SelectOption {
        value: string | number
        icon?: string
    }

    interface PricingPackage {
        subscriptions: any;
        numberOfPackages?: number;
    }

    interface DayAvailability {
        date: Date
        totalSlots: number
        availableSlots: number
        isFullyBooked: boolean
        isPastDate: boolean
    }

    interface CustomCalendarProps {
        selectedDate?: Date
        onDateSelect: (date: Date) => void
        availability: DayAvailability[]
    }
}
