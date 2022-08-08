<template>
    <div class="container">
        <h1 class="text-2xl">Checkout</h1>

        <div class="grid grid-cols-2 gap-x-32">

            <!-- Cart -->
            <div>
                <div v-if="cartProducts.length">
                    <ul>
                        <li v-for="cartProduct in cartProducts" :key="cartProduct.product.id" 
                            class="flex border-b border-gray-200 py-5"
                        >
                            <img 
                                v-if="cartProduct.product.images.length" 
                                :src="cartProduct.product.images[0].src" 
                                alt="" 
                                class="w-28 h-32 object-cover rounded-lg mr-5"
                            >
                            <div>
                                <div class="font-semibold">
                                    {{ cartProduct.product.name }}
                                </div>
                                <div>
                                    {{ cartProduct.quantity }}pcs
                                </div>
                                <div v-html="cartProduct.product.price_html"></div>
                            </div>
                        </li>
                    </ul>
                    <div>
                        <div class="flex justify-between text-xl font-semibold pt-5">
                            <div>Total</div>
                            <div>{{ cartTotals }} €</div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    Cart is empty
                </div>
            </div>

            <!-- Checkout form -->
            <div v-if="cartProducts.length">
                <h3 class="text-xl font-semibold mb-5">Your information:</h3>
                <form action="" @submit.prevent="placeOrder">
                    <div class="mb-3">
                        <label for="">First name:</label>
                        <input v-model="orderInformation.billing.first_name" type="text">
                    </div>
                    <div class="mb-3">
                        <label for="">Last name:</label>
                        <input v-model="orderInformation.billing.last_name" type="text">
                    </div>
                    <div class="mb-3">
                        <label for="">Email:</label>
                        <input v-model="orderInformation.billing.email" type="email">
                    </div>
                    <div class="mb-3">
                        <label for="">Street:</label>
                        <input v-model="orderInformation.billing.address_1" type="text">
                    </div>
                    <div class="mb-3">
                        <label for="">City:</label>
                        <input v-model="orderInformation.billing.city" type="text">
                    </div>

                    <AppButton type="submit" class="block w-full">Place order</AppButton>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import AppButton from './../components/base/AppButton.vue'

export default {
    components: {
        AppButton,
    },

    data() {
        return {
            products: [],
            orderInformation: {
                status: 'processing',
                billing: {
                    first_name: '',
                    last_name: '',
                    address_1: '',
                    city: '',
                    email: '',
                },
            }
        }
    },

    async fetch() {
        const res = await this.$axios.get('products')
        this.products = res.data
    },

    computed: {
        cartProducts() {
            if(!process.client) return []

            const cart = this.getCart()

            const cartProducts = this.products.filter(item => {
                return Object.prototype.hasOwnProperty.call(cart, item.id);
            })

            return cartProducts.map(item => {
                return {
                    product: item,
                    quantity: cart[item.id],
                }
            })
        },
        cartTotals() {
            let total = 0;

            this.cartProducts.forEach(item => {
                total += parseFloat(item.product.price) * parseInt(item.quantity)
            })

            return total
        }
    },

    methods: {
        getCart() {
            return JSON.parse(localStorage.getItem('nuxtcommerce_cart')) || {}
        },
        deleteCart() {
            localStorage.removeItem('nuxtcommerce_cart')
        },

        async placeOrder() {
            const data = this.orderInformation
            data.line_items = this.cartProducts.map(item => {
                return {
                    product_id: item.product.id,
                    quantity: item.quantity,
                }
            })

            const res = await this.$axios.post('orders', data)

            if(res.status === 201) {
                this.deleteCart()

                this.$router.push({
                    path: '/success',
                    params: {
                        fromCheckout: true
                    }
                })
            }
        }
    },
}
</script>

<style scoped>
label {
    @apply block text-sm mb-1;
}

input {
    @apply block w-full border-gray-300 rounded-lg;
}
</style>
