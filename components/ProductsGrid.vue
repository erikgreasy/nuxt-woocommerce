<template>
    <div>
        <div class="grid grid-cols-3 gap-10" v-if="$fetchState.pending">
            <div v-for="index in 6" :key="index" class="w-full h-[400px] bg-gray-200 animate-pulse"></div>
        </div>
        <div v-else class="grid grid-cols-3 gap-10">
            <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>
    </div>
</template>

<script>
import ProductCard from './ProductCard.vue'

export default {
    components: {
        ProductCard,
    },

    data() {
        return {
            products: []
        }
    },

    async fetch() {
        const res = await this.$axios.get('products?status=publish')
        this.products = res.data
    },
}
</script>

<style>

</style>