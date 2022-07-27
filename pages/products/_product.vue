<template>
    <div class="container">
        <h1>{{ product.name }}</h1>
        <div v-html="product.description"></div>
        <div class="text-xl" v-html="product.price_html"></div>

        <button class="bg-gray-100 p-3" @click="addToCart">Add to cart</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            product: {},
        }
    },

    methods: {
        async getProduct() {
            const res = await this.$axios.get('products/' + this.$route.params.product)
            this.product = res.data 
        },

        addToCart() {
            const cart = JSON.parse(localStorage.getItem('nuxtcommerce_cart')) || {}
            
            if(cart[this.$route.params.product]) {
                cart[this.$route.params.product] += 1
            } else {
                cart[this.$route.params.product] = 1
            }

            localStorage.setItem('nuxtcommerce_cart', JSON.stringify(cart))

            alert('Product has been added to cart')
        }
    },

    mounted() {
        this.getProduct()
    }

}
</script>

<style>

</style>