import { ICartStats } from '@/common/interfaces';
import { getDiscountedValue } from '@/utils';
import { selector } from 'recoil';
import { cartItemsState, shippingPlanState } from './atoms';

const EXPRESS_SHIPPING_COST = 30;

export const cartStatsState = selector<ICartStats>({
	key: 'CartStats',
	get: ({ get }) => {
		const cartItems = get(cartItemsState);
		const shippingPlan = get(shippingPlanState);

		let itemsNumber = 0;
		let subTotal = 0;
		let totalPrice = 0;

		const cartItemsArr = Array.from(cartItems.values());
		for (const cartItem of cartItemsArr) {
			itemsNumber += cartItem.quantity;

			subTotal += cartItem.price * cartItem.quantity;

			totalPrice += getDiscountedValue(cartItem.price, cartItem.discount) * cartItem.quantity;
		}

		const totalDiscount = subTotal - totalPrice;
		totalPrice += shippingPlan === 'express' ? EXPRESS_SHIPPING_COST : 0;

		return {
			itemsNumber,
			subTotal,
			totalPrice,
			totalDiscount,
		};
	},
});
