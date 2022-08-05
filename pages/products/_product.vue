<template>
    <div class="container">
        <div v-if="$fetchState.pending" class="grid grid-cols-2 gap-x-8">
            <div>
                <div class="w-full h-96 bg-gray-200 animate-pulse rounded-lg mb-5"></div>
            </div>
            <div>
                <div class="w-56 h-8 bg-gray-200 animate-pulse rounded-lg mb-5"></div>
                <div class="w-28 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
        </div>
        <div v-else class="grid grid-cols-2 gap-x-8">
            <div>
                <img v-if="product?.images?.length" :src="product.images[0].src" :alt="product.images[0].alt" class="rounded-lg h-[300px] w-full object-cover">
            </div>
            <div>
                <h1 class="font-bold text-2xl mb-5">{{ product.name }}</h1>
                <div v-html="product.price_html" class="text-3xl mb-5"></div>
                <div v-html="product.description" class="mb-10"></div>

                <AppButton @click="addToCart">Add to cart</AppButton>
            </div>
        </div>
    </div>
</template>

<script>
import AppButton from '~/components/base/AppButton.vue'

export default {
    components: {
        AppButton,
    },

    data() {
        return {
            product: {},
        }
    },

    async fetch() {
        const res = await this.$axios.get('products/' + this.$route.params.product.split('-')[0])
        this.product = res.data 
    },

    methods: {
        addToCart() {
            const cart = JSON.parse(localStorage.getItem('nuxtcommerce_cart')) || {}
            
            if(cart[this.product.id]) {
                cart[this.product.id] += 1
            } else {
                cart[this.product.id] = 1
            }

            localStorage.setItem('nuxtcommerce_cart', JSON.stringify(cart))

            alert('Product has been added to cart')
        }
    },
}
</script>

<style>

</style>