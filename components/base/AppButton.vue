<template>
    <button v-bind="$attrs" v-on="$listeners" class="bg-primary text-white py-3 px-20 rounded-lg">
        <slot></slot>
    </button>
</template>
