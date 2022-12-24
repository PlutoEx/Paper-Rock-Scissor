<?php require_once ROOT.'/views/layouts/header.php'; ?>
<script src="/public/js/game.js" defer></script>

<div class="wrapper">
    <span style="display: inline-block">
        <div class="playground"></div>
    </span>
    <span class="win" style="display: inline-block; margin-left: 10px; vertical-align:top">
        <div class="table">
            <h2 style="text-align: center; margin-top: 5px">Counter</h2>
            <div style="font-size: 20px; font-weight: bold;">
                <div style="color: blue">Paper: <text class="paperCount" style="float: right">0</text></div>
                <div style="color: red">Rock: <text class="rockCount" style="float: right">0</text></div>
                <div style="color: green">Scissor: <text class="scissorCount" style="float: right">0</text></div>
            </div>
        </div>
    </span>
</div>

<?php require_once ROOT.'/views/layouts/footer.php'; ?>