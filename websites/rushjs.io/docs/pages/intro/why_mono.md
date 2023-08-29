---
title: Why one big repo⁈
---

_Open source NPM packages seem to be developed in lots of small GitHub repos. Shouldn't I do that?_

Sure, if you're building isolated components, and it's not too important how they fit together. But business software doesn't seem to work that way. It's more like this:

Most people start out by building a single web application, not a bunch of libraries. After your application ships, it keeps growing in size. Then one day you need to share some code with a different project, and you realize you've got a big rat's nest. Time to refactor!

Clearly you must split this thing up into manageable components. NPM packages are the way to do that in JavaScript. Looking around, the convention seems to be "**one GitHub repo for each NPM package.**" During a heroic week or two, you create 10 Git repos, split up your code, and give it a try...

...but working with 10 Git repos turns out to be a big pain! There are just so many headaches:

- **Tunnel vision**: If a colleague mostly does their work in repos #5 and #6, they seem to completely ignore pull requests from the other 8 repos. New repos spring into existence every day without you even knowing about it.

- **Cascading publishing**: Propagating a fix from **lib3** down to your application project requires updating/building/publishing many Git repos in the right order: **lib3** --> **lib2** --> **lib1** --> **application**. When **lib3** has frequent churn, this becomes really tedious. How will people even remember the right order to publish? The internet has lots of bodies to throw at this problem, but you have limited people, and they're very busy.

- **Downstream victims**: When Bob publishes a change to **lib3**, it can take a while before all downstream projects get upgraded to use it. If there's a regression, it might be a week before Alice tries to run "npm update" in **lib1** and discovers the problem. By then, maybe Bob has left for his backpacking trip across Europe. Why should Alice shoulder the burden of fixing someone else's regression? Seems like every time she upgrades, something is broken!

- **Linking madness**: The workaround is to use [npm link](https://docs.npmjs.com/cli/link) to symlink your **application** directly to **lib3** for testing. But NPM creates symlinks via a global folder, which causes trouble if you need to work with multiple branches of **lib3** on the same laptop. And with 10+ libraries, it's hard to remember what is symlinked to what.

The **"one repo per package"** model makes sense for isolated projects that are maintained by uncoordinated strangers. (Also, most of those libraries get updated fairly infrequently, which makes the problem easier.) Whereas in our example, everyone works at the same company, and the "libraries" act more like components of an integrated architecture. Code gets churned a lot, and a change in one place can easily break another part of the system. Building multiple projects together lets you run all the unit tests for every change, which moves responsibility for fixes where it belongs: To the person who originally introduced the change.

The emergent principle becomes **"one Git repo per team"**, or even better **"as few Git repos as possible to get the job done"**.

<div>
  <img src="/images/home/mono-concept-h.svg" alt="monorepo block diagram" style={{ width: '50rem' }} />
  <p />
</div>

[Lots](https://danluu.com/monorepo/) [of](https://medium.com/@bebraw/the-case-for-monorepos-907c1361708a) [people](http://blog.shippable.com/our-journey-to-microservices-and-a-mono-repository) who build large scale business software seem to end up with all their code in one big "monorepo". JavaScript is just the last guy to join the party.

The big concern with this strategy is obviously _**build times**_. JavaScript tools are slower than compiled languages. If one project takes 1 minute to build, and you have 75 projects, in theory you could be looking at a ridiculous 75 minute build time. It seems intimidating, but with an industrial strength toolchain you can scale very far before build times become an issue. Most of our roadmap for Rush and Heft is focused on build times, and we're optimistic that there's still plenty of room for optimizations. With subset/incremental builds, you can in theory avoid rebuilding everything unless a change really does affect everything -- and for that kind of change, it's hard to argue that finding breaks early isn't worth the price of waiting for a longer build.
