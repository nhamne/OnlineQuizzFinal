<template>
  <table class="w-full text-left">
    <thead>
      <tr class="uppercase text-xs text-gray-400 font-semibold [&>th]:px-2 [&>th]:pb-2">
        <th class="w-12 p-4 text-center">
          <input
            type="checkbox"
            class="w-4 h-4 cursor-pointer accent-primary rounded border-gray-300"
          />
        </th>
        <th :class="customClassTitle">STT</th>
        <th v-for="item in listTitle" :key="item.key" :class="[customClassTitle, item.thClass]">
          {{ item.title }}
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- duyệt qua từng hàng dữ liệu-->
      <tr
        v-for="(item, index) in listBody"
        :key="item.id"
        class="hover:bg-primary/5 [&>td]:px-2 cursor-pointer transition-all duration-200"
        :class="customClassBody"
      >
        <td class="w-12 p-4 text-center">
          <input
            type="checkbox"
            class="w-4 h-4 cursor-pointer accent-primary rounded border-gray-300"
          />
        </td>
        <td class="py-4 text-medium">{{ index + 1 }}</td>

        <!--duyệt qua từng cột dữ liệu trong item, nó sẽ là dữ liệu của cột đó-->
        <td
          v-for="col in listTitle"
          :key="col.key"
          class="py-4 text-medium text-black/80"
          :class="col.tdClass"
        >
          <!-- <slot v-if="col.isAction" name="custom-td" :item="item"> </slot> -->
          <slot :name="col.key" :item="item">
            <span>{{ item[col.key] }}</span>
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import Icon from './Icon.vue'
import Button from './Button.vue'
interface TableColumn {
  title: string
  key: string
  thClass?: string
  tdClass?: string
}

interface TableData {
  id: number
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
  listBody?: TableData[]
  listTitle?: TableColumn[]
}>()
</script>
