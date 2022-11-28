import { Injectable, HostListener, Inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { WINDOW } from "./windows.service";
// Menu
export interface Menu {
	path?: string;
	title?: string;
	icon?: string;
	type?: string;
	badgeType?: string;
	badgeValue?: string;
	active?: boolean;
	bookmark?: boolean;
	children?: Menu[];
}

@Injectable({
	providedIn: 'root'
})

export class NavService {

	public screenWidth: any
	public collapseSidebar: boolean = false

	constructor(@Inject(WINDOW) private window) {
		this.onResize();
		if (this.screenWidth < 991) {
			this.collapseSidebar = true
		}
	}

	// Windows width
	@HostListener("window:resize", ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
	}

	MENUITEMS: Menu[] = [
		{
			path: '/dashboard/default', title: 'Dashboard', icon: 'home', type: 'link', badgeType: 'primary', active: false
		},
		{
			title: 'Orders', icon: 'dollar-sign', type: 'sub', active: false, children: [
				{ path: '/sales/all-orders', title: 'All orders', type: 'link' },
				{ path: '/sales/orders', title: 'New orders', type: 'link' },
				{ path: '/sales/primary-order', title: 'Primary order', type: 'link' },
				{ path: '/sales/renewal-order', title: 'Renewal order', type: 'link' },
				{ path: '/sales/replacement-order', title: 'Replacement order', type: 'link' },
				{ path: '/sales/return-order', title: 'Return order', type: 'link' },
				{ path: '/sales/cancelled-orders', title: 'Cancelled orders', type: 'link' },
				{ path: '/sales/upcoming-renewals', title: 'Upcoming renewals', type: 'link' },
				{ path: '/sales/notes', title: 'Notes', type: 'link' },
				// { path: '/sales/orders-panel', title: 'Orders panel', type: 'link' },
				// { path: '/sales/user-requests', title: 'User requests', type: 'link' },
				// { path: '/sales/manage-orders', title: 'Manage orders', type: 'link' },
				// { path: '/sales/deposits', title: 'Deposits', type: 'link' },
				// { path: '/sales/others', title: 'others', type: 'link' },
				// { path: '/sales/transactions', title: 'Transactions', type: 'link' },
			]
		},
		{
			title: 'Requests', icon: 'user', type: 'sub', active: false, children: [
				{ path: '/users/replacement-request', title: 'Replacement / Upgrade', type: 'link' },
				{ path: '/users/return-request', title: 'Return', type: 'link' }
			]
		},
		{
			title: 'Customers', path: '/users/customers', icon: 'user', type: 'link', active: false
		},
		{
			title: 'Reviews', path: '/users/reviews', icon: 'eye', type: 'link', active: false
		},
		{
			title: 'eKYC', path: '/users/kyc-list', icon: 'eye', type: 'link', active: false
		},
		{
			title: 'Catalogue', icon: 'box', type: 'sub', active: false, children: [
				{title: 'Accessories', path: '/products/digital/accessories',  type: 'link'},
				{title: 'Pricing Schemes', path: '/products/digital/pricing-schemes',  type: 'link'},
				{title: 'Specification', type: 'link', path: '/products/digital/digital-specs'},
				{title: 'Category group', type: 'link', path: '/products/digital/digital-category'},
				{title: 'Category', type: 'link', path: '/products/digital/digital-sub-category'},
				{title: 'Products', path: '/products/digital/digital-product-list',  type: 'link'},
				{title: 'Scrollers', path: '/products/digital/digital-scrollers',  type: 'link'},
				{title: 'Pincodes', path: '/products/digital/pincodes',  type: 'link'},
				{title: 'Upload files', path: '/products/digital/upload-files',  type: 'link'},
				// {
				// 	title: 'Physical', type: 'sub', children: [
				// 		{ path: '/products/physical/category', title: 'Category', type: 'link' },
				// 		{ path: '/products/physical/sub-category', title: 'Sub Category', type: 'link' },
				// 		{ path: '/products/physical/product-list', title: 'Product List', type: 'link' },
				// 		{ path: '/products/physical/product-detail', title: 'Product Detail', type: 'link' },
				// 		{ path: '/products/physical/add-product', title: 'Add Product', type: 'link' },
				// 	]
				// },
				// {
				// 	title: 'digital', type: 'sub', children: [
				// 		{ path: '/products/digital/digital-category', title: 'Category', type: 'link' },
				// 		{ path: '/products/digital/digital-sub-category', title: 'Sub Category', type: 'link' },
				// 		{ path: '/products/digital/digital-product-list', title: 'Product List', type: 'link' },
				// 		{ path: '/products/digital/digital-add-product', title: 'Add Product', type: 'link' },
				// 	]
				// },
			]
		},		
		{
			title: 'Reports', icon: 'bar-chart', type: 'sub', active: false
		},
		{
			title: 'Users', path: '/sales/orders', icon: 'user', type: 'link', active: false
		},
		{
			title: 'Settings', icon: 'settings', type: 'sub', active: false
		},
		// {
		// 	title: 'Coupons', icon: 'tag', type: 'sub', active: false, children: [
		// 		{ path: '/coupons/list-coupons', title: 'List Coupons', type: 'link' },
		// 		{ path: '/coupons/create-coupons', title: 'Create Coupons', type: 'link' },
		// 	]
		// },
		// {
		// 	title: 'Pages', icon: 'clipboard', type: 'sub', active: false, children: [
		// 		{ path: '/pages/list-page', title: 'List Page', type: 'link' },
		// 		{ path: '/pages/create-page', title: 'Create Page', type: 'link' },
		// 	]
		// },
		// {
		// 	title: 'Media', path: '/media', icon: 'camera', type: 'link', active: false
		// },
		// {
		// 	title: 'Menus', icon: 'align-left', type: 'sub', active: false, children: [
		// 		{ path: '/menus/list-menu', title: 'Menu Lists', type: 'link' },
		// 		{ path: '/menus/create-menu', title: 'Create Menu', type: 'link' },
		// 	]
		// },
		// {
		// 	title: 'Users', icon: 'user-plus', type: 'sub', active: false, children: [
		// 		{ path: '/users/list-user', title: 'User List', type: 'link' },
		// 		{ path: '/users/create-user', title: 'Create User', type: 'link' },
		// 	]
		// },
		// {
		// 	title: 'Vendors', icon: 'users', type: 'sub', active: false, children: [
		// 		{ path: '/vendors/list-vendors', title: 'Vendor List', type: 'link' },
		// 		{ path: '/vendors/create-vendors', title: 'Create Vendor', type: 'link' },
		// 	]
		// },
		// {
		// 	title: 'Localization', icon: 'chrome', type: 'sub', children: [
		// 		{ path: '/localization/translations', title: 'Translations', type: 'link' },
		// 		{ path: '/localization/currency-rates', title: 'Currency Rates', type: 'link' },
		// 		{ path: '/localization/taxes', title: 'Taxes', type: 'link' },
		// 	]
		// },
		// {
		// 	title: 'Reports', path: '/reports', icon: 'bar-chart', type: 'link', active: false
		// },
		// {
		// 	title: 'Settings', icon: 'settings', type: 'sub', children: [
		// 		{ path: '/settings/profile', title: 'Profile', type: 'link' },
		// 	]
		// },
		// {
		// 	title: 'Invoice', path: '/invoice', icon: 'archive', type: 'link', active: false
		// },
		// {
		// 	title: 'Login',path: '/auth/login', icon: 'log-in', type: 'link', active: false
		// }
	]
	// Array
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);


}
