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