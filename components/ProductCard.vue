<template>
    <article>
        <NuxtLink :to="`/products/${product.id}-${product.slug}`">
            <img v-if="product?.images?.length" :src="product.images[0].src" :alt="product.images[0].alt" class="rounded-lg h-[400px] w-full object-cover transition hover:opacity-80">
        </NuxtLink>
        <h3 class="mt-2 mb-2">
            <NuxtLink :to="`/products/${product.id}-${product.slug}`">{{ product.name }}</NuxtLink>
        </h3>
        <div class="text-lg" v-html="product.price_html"></div>
    </article>
</template>

<script>
export default {
    props: {
        product: Object,
    }
}
</script>

<style>

</style>