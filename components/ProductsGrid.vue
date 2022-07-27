<template>
    <div class="grid grid-cols-3 gap-10">
        <article v-for="product in products" :key="product.id" class="text-center bg-gray-100 p-10">
            <h3>
                <NuxtLink :to="`/products/${product.id}`">{{ product.name }}</NuxtLink>
            </h3>
        </article>
    </div>
</template>

<script>
export default {
    data() {
        return {
            products: []
        }
    },

    methods: {
        async getProducts() {
            const res = await this.$axios.get('products')
            this.products = res.data
        }
    },

    mounted() {
        this.getProducts()
    }
}
</script>

<style>

</style>