export interface ApidogModel {
    success: boolean;
    vendor_stats: VendorStats;
    [property: string]: any;
}

export interface VendorStats {
    monthly_orders: MonthlyOrder[];
    monthly_revenue: MonthlyRevenue[];
    total_customers: number;
    total_orders: number;
    total_revenue: string;
    total_sales: number;
    [property: string]: any;
}

export interface MonthlyOrder {
    month?: number;
    total_orders?: number;
    [property: string]: any;
}

export interface MonthlyRevenue {
    month?: number;
    total_revenue?: number;
    [property: string]: any;
}
