<template>
    <div class="container">
        <h1 class="text-2xl">Checkout</h1>

        <!-- Cart -->
        <div>
            <ul v-if="cartProducts.length">
                <li v-for="cartProduct in cartProducts" :key="cartProduct.product.id">
                    {{ cartProduct.product.name }} ...... {{ cartProduct.quantity }}
                </li>
            </ul>
            <div v-else>
                Cart is empty
            </div>
        </div>

        <!-- Checkout form -->
        <div v-if="cartProducts.length">
            <h3 class="text-xl">Your information:</h3>
            <form action="" @submit.prevent="placeOrder">
                <div>
                    <label for="">First name:</label>
                    <input v-model="orderInformation.billing.first_name" type="text">
                </div>
                <div>
                    <label for="">Last name:</label>
                    <input v-model="orderInformation.billing.last_name" type="text">
                </div>
                <div>
                    <label for="">Email:</label>
                    <input v-model="orderInformation.billing.email" type="email">
                </div>
                <div>
                    <label for="">Street:</label>
                    <input v-model="orderInformation.billing.address_1" type="text">
                </div>
                <div>
                    <label for="">City:</label>
                    <input v-model="orderInformation.billing.city" type="text">
                </div>

                <AppButton type="submit">Place order</AppButton>
            </form>
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
