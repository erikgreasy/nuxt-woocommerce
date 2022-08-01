<template>
    <div>
        <div class="grid grid-cols-3 gap-10" v-if="$fetchState.pending">
            <article v-for="index in 6" :key="index" class="w-full h-28 bg-gray-200 animate-pulse"></article>
        </div>
        <div v-else class="grid grid-cols-3 gap-10">
            <article v-for="product in products" :key="product.id" class="text-center bg-gray-100 p-10">
                <h3>
                    <NuxtLink :to="`/products/${product.id}-${product.slug}`">{{ product.name }}</NuxtLink>
                </h3>
            </article>
        </div>
    </div>
</template>

<script>
export default {
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