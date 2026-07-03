<template>
  <table class="w-full text-left">
    <thead>
      <tr class="uppercase text-xs text-gray-400 font-semibold [&>th]:px-10 [&>th]:pb-2">
        <th class="w-12 p-4 text-center">
          <input
            type="checkbox"
            class="w-4 h-4 cursor-pointer accent-primary rounded border-gray-300"
          />
        </th>
        <th
          v-for="item in listTitle"
          :key="item.title"
          :class="[customClassTitle, 'last:text-right']"
        >
          {{ item.title }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, index) in listBody"
        :key="item.id"
        class="hover:bg-primary/5 [&>td]:px-10 cursor-pointer transition-all duration-200"
        :class="customClassBody"
      >
        <td class="w-12 p-4 text-center">
          <input
            type="checkbox"
            class="w-4 h-4 cursor-pointer accent-primary rounded border-gray-300"
          />
        </td>
        <td class="py-4 text-medium">{{ index + 1 }}</td>
        <td class="py-4 text-medium font-semibold text-black/80">{{ item.name }}</td>
        <td class="py-4 text-medium text-black/80">{{ item.email }}</td>
        <td class="py-4 text-medium">{{ item.joinDate }}</td>
        <!-- <td class="py-4 text-medium"> -->
        <slot name="custom-td" :item="item"> </slot>
        <!-- </td> -->
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import Icon from './Icon.vue'
import Button from './Button.vue'
interface Title {
  title: string
}

interface Body {
  id: number
  name: string
  email: string
  joinDate: string
  [key: string]: any
}

const {
  customClassTitle,
  customClassBody,
  listBody = [],
  listTitle = [],
} = defineProps<{
  customClassTitle?: string
  customClassBody?: string
  listBody?: Body[]
  listTitle?: Title[]
}>()
</script>
