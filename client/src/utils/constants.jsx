import { AiFillDashboard } from 'react-icons/ai';
import { MdGroup } from 'react-icons/md';
import { TbBrandProducthunt } from 'react-icons/tb';
import { RiBillLine } from 'react-icons/ri';
import { MdCategory } from 'react-icons/md';

import path from './path';

export const navigation = [
    {
        id: 1,
        value: 'HOME',
        path: `/${path.HOME}`,
    },
    {
        id: 2,
        value: 'PRODUCTS',
        path: `/${path.PRODUCTS}`,
    },
    {
        id: 3,
        value: 'BLOGS',
        path: `/${path.BLOGS}`,
    },
    {
        id: 4,
        value: 'OUR SERVICES',
        path: `/${path.OUR_SERVICES}`,
    },
    {
        id: 5,
        value: 'FAQ',
        path: `/${path.FAQ}`,
    },
];

export const productInforTabs = [
    {
        id: 1,
        name: 'DESCRIPTION',
        content: `Technology: GSM / HSPA / LTE
        Dimensions: 153.8 x 75.5 x 7.6 mm
        Weight: 154 g
        Display: IPS LCD 5.5 inches
        Resolution: 720 x 1280
        OS: Android OS, v6.0 (Marshmallow)
        Chipset: Octa-core
        CPU: Octa-core
        Internal: 32 GB, 4 GB RAM
        Camera: 13MB - 20 MP`,
    },
    {
        id: 2,
        name: 'WARRANTY',
        content: `Warranty Information
        LIMITED WARRANTIES
        Limited Warranties are non-transferable. The following Limited Warranties are given to the original retail purchaser of the following Ashley Furniture Industries, Inc.Products:
        Frames Used In Upholstered and Leather Products
        Limited Lifetime Warranty
        A Limited Lifetime Warranty applies to all frames used in sofas, couches, love seats, upholstered chairs, ottomans, sectionals, and sleepers. Ashley Furniture Industries,Inc. warrants these components to you, the original retail purchaser, to be free from material manufacturing defects.`,
    },
    {
        id: 3,
        name: 'DELIVERY',
        content: `Purchasing & Delivery
        Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
        Picking up at the store
        Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
        Delivery
        Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
        In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`,
    },
    {
        id: 4,
        name: 'PAYMENT',
        content: `Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
        Picking up at the store
        Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
        Delivery
        Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
        In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`,
    },
];

export const colors = [
    'red',
    'blue',
    'green',
    'yellow',
    'orange',
    'purple',
    'pink',
    'brown',
    'black',
    'white',
];

export const sorts = [
    {
        id: 1,
        value: '-createdAt',
        text: 'Date, new to old',
    },

    {
        id: 2,
        value: 'title',
        text: 'Alphabeticaly, A-Z',
    },
    {
        id: 3,
        value: '-title',
        text: 'Alphabeticaly, Z-A',
    },
    {
        id: 4,
        value: '-price',
        text: 'Price, high to low',
    },
    {
        id: 5,
        value: 'price',
        text: 'Price, low to high',
    },
    {
        id: 6,
        value: '-sold',
        text: 'Best selling',
    },
    {
        id: 7,
        value: 'createdAt',
        text: 'Date, old to new',
    },
];

export const voteOptions = [
    {
        id: 1,
        text: 'Terrible',
    },
    {
        id: 2,
        text: 'Bad',
    },
    {
        id: 3,
        text: 'Normal',
    },
    {
        id: 4,
        text: 'Good',
    },
    {
        id: 5,
        text: 'Perfect',
    },
];

export const adminSidebar = [
    {
        id: 1,
        type: 'single',
        text: 'Dashboard',
        path: `/${path.ADMIN}/${path.DASHBOARD}`,
        icon: <AiFillDashboard size={20} />,
    },
    {
        id: 2,
        type: 'single',
        text: 'Manage users',
        path: `/${path.ADMIN}/${path.MANAGE_USERS}`,
        icon: <MdGroup size={20} />,
    },
    {
        id: 3,
        type: 'parent',
        text: 'Manage products',
        path: `/${path.ADMIN}/${path.MANAGE_USERS}`,
        icon: <TbBrandProducthunt size={20} />,
        submenu: [
            {
                text: 'Create product',
                path: `/${path.ADMIN}/${path.CREATE_PRODUCT}`,
            },
            {
                text: 'Manage products',
                path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
            },
        ],
    },
    {
        id: 4,
        type: 'parent',
        text: 'Manage category',
        path: `/${path.ADMIN}/${path.MANAGE_CATEGORY}`,
        icon: <MdCategory size={20} />,
        submenu: [
            {
                text: 'Create category',
                path: `/${path.ADMIN}/${path.CREATE_CATEGORY}`,
            },
            {
                text: 'Manage category',
                path: `/${path.ADMIN}/${path.MANAGE_CATEGORY}`,
            },
        ],
    },
    {
        id: 5,
        type: 'single',
        text: 'Manage orders',
        path: `/${path.ADMIN}/${path.MANAGE_ORDERS}`,
        icon: <RiBillLine size={20} />,
    },
];

export const memberSidebar = [
    {
        id: 1,
        type: 'single',
        text: 'Persional',
        path: `/${path.MEMBER}/${path.PERSIONAL}`,
        icon: <AiFillDashboard size={20} />,
    },
    {
        id: 2,
        type: 'single',
        text: 'My cart',
        path: `/${path.MEMBER}/${path.MY_CART}`,
        icon: <MdGroup size={20} />,
    },
    {
        id: 3,
        type: 'single',
        text: 'Buy history',
        path: `/${path.MEMBER}/${path.HISTORY}`,
        icon: <RiBillLine size={20} />,
    },
];
