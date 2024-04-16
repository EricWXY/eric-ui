<template>
  <er-popconfirm
    width="220"
    confirm-button-text="Delete"
    cancel-button-text="No,Thanks"
    icon="trash"
    icon-color="#626aef"
    title="Are you sure to delete this item?"
    @confirm="$message.success('Delete Success')"
    @cancel="$message.info('Cancel')"
  >
    <er-button>Delete</er-button>
  </er-popconfirm>
</template>
