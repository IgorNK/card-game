<script lang='ts'>
  import type { TPlayerStats } from "../../types";
  export let playerStats: TPlayerStats;
</script>

<div class=stats>
  <div class=health>{playerStats.currentHealth}/{playerStats.health}({playerStats.defense})</div>
  <div class=mana>
    <span class=red>{playerStats.currentManaRed}/{playerStats.manaRed}</span>
    <span class=blue>{playerStats.currentManaBlue}/{playerStats.manaBlue}</span>
    <span class=green>{playerStats.currentManaGreen}/{playerStats.manaGreen}</span>
  </div>
  <div class=exp>{playerStats.exp}/{playerStats.expNext}</div>
</div>

<style>
  .stats {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
  }

  .health {

  }

  .mana {

  }

  .red {
    color: #d33c3c;
  }

  .blue {
    color: #3399ff
  }

  .green {
    color: #99ff66;
  }

</style>