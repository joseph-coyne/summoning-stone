<table align="center"><tr><td align="center" width="9999">
<img src="https://i.imgur.com/IsduleF.png" align="center" width="150" alt="Project icon">

# Summoning Stone

A Discord bot that hosts a single post for sending mentions to a whitelisted group of members + minor server management.
</td></tr></table>

## Usage

A post is created in a specified channel. When a member is whitelisted and added to the post, they can be "summoned" by having the bot mentioned them when a reaction to the emoji they chose is clicked. The mention stays until the user interacts with the server. 

![Summoming post](https://i.imgur.com/Gvehl8T.png)

Members can request to be added by using the command paired with the emoji they want to trigger their summon.

```
!addsummon {emoji}
```

All requests are sent to a specified channel for approvals that can easily be moderated. 

![Summon request example](https://i.imgur.com/fJphbeN.png)

Members can also submit a seperate request for a custom emoji in the body of an image post.

```
!addemoji {name}
```


All commands are available via ```!help```

![Summoning Stone help message](https://i.imgur.com/9ZCuLsN.png)
