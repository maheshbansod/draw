import { ref } from "vue";

const history = ref<{
    id: string;
    type: 'pen' | 'eraser' | 'text';
    data: any;
}[]>([]);

