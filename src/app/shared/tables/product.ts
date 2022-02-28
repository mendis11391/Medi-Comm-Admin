// Product Colors
export type ProductColor = 'white' | 'black' | 'red' | 'green' | 'purple' | 'yellow' | 'blue' | 'gray' | 'orange' | 'pink';

// Product Size
export type ProductSize = 'M' | 'L' | 'XL';

// Product Tag
export type ProductTags = 'nike' | 'puma' | 'lifestyle' | 'caprese';

// Product
export interface Product {
  id?: number;
  prod_id?: string;
  title?: string;
  description?: string;
  price?: number;
  product_image?: string;
  status?: boolean;
  brand?: string;
  ram?: string;
  processor?: string;
  screen_size?: string;
  disk_type?: string;
  disk_size?: string;
  specifications?: string;
  tenure?:[];
  price_list?: any;
  specs?:any
  main_cat_id?:number;
  cat_id?:number;
  delivery_timeline?:number;
  prod_name?:string;
  metaTitle?:string;
  metaDescription?:string;
  metaKeywords?:string;
  slug?:string;
  prod_image?:string;
  prod_description?:string;
  securityDeposit?:string;
  tenure_base_price?:string;
  prod_status?:Boolean;
  priority?:number;
  position?:number;
}

export interface Category {
  id?: number;
  category_name?: string;
}


// Color Filter
export interface ColorFilter {
  color?: ProductColor;
}

// Tag Filter
export interface TagFilter {
  tag?: ProductTags
}