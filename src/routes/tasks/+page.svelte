<script>
  import { tasks } from '$lib/stores';
  import { lookupColor } from '$lib/palette';
</script>

<h1>Tasks</h1>
<table>
  {#each $tasks as task}
    <tr
    style="background-color: {lookupColor(task.cssColor)};">
      <td>{task.title}</td>
      <td>{task.hours}</td>
    </tr>
  {/each}
</table>
