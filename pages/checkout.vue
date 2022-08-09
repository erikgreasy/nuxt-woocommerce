<template>
    <div class="container">
        <h1 class="text-2xl">Checkout</h1>

        <div class="grid grid-cols-2 gap-x-32">

            <!-- Cart -->
            <div>
                <div v-if="message" class="rounded-lg bg-red-300 py-3 px-10 text-red-800">
                    {{ message }}
                </div>
                <div v-if="errors" class="rounded-lg bg-red-300 py-3 px-10 text-red-800">
                    {{ errors.message }}
                </div>

                <div v-if="cartProducts.length">
                    <ul>
                        <li v-for="cartProduct in cartProducts" :key="cartProduct.product.id" 
                            class="flex border-b border-gray-200 py-5"
                        >
                            <NuxtLink :to="`/products/${cartProduct.product.id}-${cartProduct.product.slug}`">
                                <img 
                                    v-if="cartProduct.product.images.length" 
                                    :src="cartProduct.product.images[0].src" 
                                    alt="" 
                                    class="w-28 h-32 object-cover rounded-lg mr-5"
                                >
                            </NuxtLink>
                            <div>
                                <div class="font-semibold">
                                    <NuxtLink :to="`/products/${cartProduct.product.id}-${cartProduct.product.slug}`">
                                        {{ cartProduct.product.name }}
                                    </NuxtLink>
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

                    <!-- Shipping -->
                    <div class="mt-5 py-5 border-t border-gray-200 ">
                        <h3 class="text-xl font-semibold mb-5">Shipping:</h3>

                        <select v-model="selectedShippingZone" @change="chooseShippingZone" class="mb-5">
                            <option v-for="zone in shippingZones" :key="zone.id" :value="zone.id">
                                {{ zone.name }}
                            </option>
                        </select>

                        <ul class="grid grid-cols-2 gap-3">
                            <li 
                                v-for="method in shippingMethods" :key="method.id" 
                                @click="chooseShippingMethod(method)"
                                :class="{'border-primary' : method.method_id === orderInformation.shipping_lines[0]?.method_id}"
                                class="border-2 border-gray-200 rounded-lg p-4 text-sm hover:cursor-pointer"
                            >
                                <div>
                                    {{ method.settings.title.value }}
                                </div>
                                <div class="text-gray-500 mb-3">
                                    {{ method.settings.title.description }}
                                </div>
                                <div>
                                    <span v-if="method.settings.cost.value">
                                        {{ method.settings.cost.value }} €
                                    </span>
                                    <span v-else>
                                        Free
                                    </span>
                                </div>
                            </li>
                        </ul>
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
            shippingMethods: [],
            shippingZones: [],
            selectedShippingZone: null,
            orderInformation: {
                status: 'processing',
                billing: {
                    first_name: '',
                    last_name: '',
                    address_1: '',
                    city: '',
                    email: '',
                },
                shipping_lines: []
            },
            message: null,
            errors: null,
        }
    },

    async fetch() {
        const [productsRes, shippingZonesRes] = await Promise.all([
            this.$axios.get('products?status=publish'),
            this.$axios.get('shipping/zones')
        ])
        
        this.products = productsRes.data
        this.shippingZones = shippingZonesRes.data.filter(zone => zone.id !== 0)
    },

    computed: {
        cartProducts() {
            if(!process.client || this.$fetchState.pending) return []

            const cart = this.getCart()

            const cartProducts = this.products.filter(item => {
                return Object.prototype.hasOwnProperty.call(cart, item.id);
            })

            const cartProductIds = cartProducts.map(item => item.id)

            Object.entries(cart).forEach(item => {
                let removed = false

                if( !cartProductIds.includes( parseInt(item[0]) ) ) {
                    this.removeFromCart(parseInt(item[0]))
                    removed = true
                }

                if(removed) {
                    this.message = 'Product has been removed from cart, because it is no longer available.'
                }
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
        removeFromCart(productId) {
            const cart = this.getCart()
            delete cart[productId]

            localStorage.setItem('nuxtcommerce_cart', JSON.stringify(cart))
        },

        async chooseShippingZone() {
            const res = await this.$axios.get(`shipping/zones/${this.selectedShippingZone}/methods`)

            this.shippingMethods = res.data
        },

        chooseShippingMethod(method) {
            this.orderInformation.shipping_lines = [{
                method_id: method.method_id,
                method_title: method.title,
                total: method.settings.cost.value,
            }]
        },

        async placeOrder() {
            const data = this.orderInformation
            this.errors = null

            data.line_items = this.cartProducts.map(item => {
                return {
                    product_id: item.product.id,
                    quantity: item.quantity,
                }
            })

            try {
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
            } catch(err) {
                this.errors = err.response.data
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
