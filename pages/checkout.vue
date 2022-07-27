<template>
    <div>
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
                    <input type="text" v-model="orderInformation.billing.first_name">
                </div>
                <div>
                    <label for="">Last name:</label>
                    <input type="text" v-model="orderInformation.billing.last_name">
                </div>
                <div>
                    <label for="">Email:</label>
                    <input type="email" v-model="orderInformation.billing.email">
                </div>
                <div>
                    <label for="">Street:</label>
                    <input type="text" v-model="orderInformation.billing.address_1">
                </div>
                <div>
                    <label for="">City:</label>
                    <input type="text" v-model="orderInformation.billing.city">
                </div>

                <button>Place order</button>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            products: [],
            cartProducts: [],
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

    methods: {
        getCart() {
            return JSON.parse(localStorage.getItem('nuxtcommerce_cart')) || {}
        },
        deleteCart() {
            localStorage.removeItem('nuxtcommerce_cart')
        },
        async getProducts() {
            const res = await this.$axios.get('products')
            this.products = res.data

            const cart = this.getCart()

            const cartProducts = this.products.filter(item => {
                return Object.prototype.hasOwnProperty.call(cart, item.id);
            })

            this.cartProducts = cartProducts.map(item => {
                return {
                    product: item,
                    quantity: cart[item.id],
                }
            })
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

    mounted() {
        this.getProducts()
    }

}
</script>

<style>

</style>