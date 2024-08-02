# Vrün Frontend Pages/Components

## Possible Requirements
Each page/component may have some requirements for when it can be shown (vs
showing that the requirements aren't met or some other redirect/placeholder).
Here we list all the possible kinds of requirements and what they mean.

* Connected
    : an Ethereum wallet is connected
* Registered
    : the connected account is registered with Rocket Pool
* Signed
    : the connected account has signed the Vrün terms of service
* Admin
    : the connected account is a Vrün admin address

## Pages/Components

In some cases it is still unclear whether these should be pages (with routes)
vs modals or components on another page. Where a route is definitely required,
that is listed in the description of the page/component.

### Landing

The front page. Should include:
- Prominent link to joining the Discord
- Prominent link to getting started as a user
- High-level Information about Vrün

Route: `/`

### FAQ

Static page with FAQs.

Route: `/faqs`

### Pricing

Almost-static page (data fetched from fee server) with current prices and
payment methods for purchasing Vrün validator days.

Route: `/pricing`

### Terms

Static page with current terms of service.

Route: `/terms`

### Sign Terms

Collect and submit signature from user, accepting the Vrün terms of service.

Requires:
- Connected
- (probably) Not Signed

### Register Rocket Pool

Create transaction to register the user's account as a Rocket Pool node.

Requires:
- Connected
- Not Registered

### Stake RPL

Create transaction to stake RPL on the user's Rocket Pool node.

Requires:
- Connected
- Registered

### Purchase Days

Create transaction to send funds to Vrün. Also, submit request to Vrün to
acknowledge a transaction as a payment for a requested number of Vrün validator
days.

Requires:
- Connected
- Registered
- Signed

### Create Validator(s)

Submit request to Vrün to create validators with the provided data, and create the deposit transactions with Rocket Pool.

Requires:
- Connected
- Registered
- Signed

### Stake Validator(s)

Create transaction to complete staking validators with Rocket Pool after the scrub period.

Requires:
- Connected
- Registered
- Signed

### Join/Leave Smoothing Pool

Create transaction to join or leave the Rocket Pool smoothing pool.

Requires:
- Connected
- Registered

### Change Withdrawal Address

Create transaction to change the Rocket Pool node's withdrawal
address. Generally not needed: we expect Vrün users to use their node address
as withdrawal address. But useful for cases where they want to use another
address instead.

Requires:
- Connected
- Registered

### Change Timezone

Create transaction to change the Rocket Pool node's timezone.
Generally not needed.

Requires:
- Connected
- Registered

### Batch Edit Graffiti

Submit request to Vrün to update the graffiti for all the user's validators.

Requires:
- Connected
- Registered
- Signed

### Account

Show all kinds of information about the user's account in one place. This will include:
- List of user's validators (and summary of info about them)
- Summary of user's credit balance (days purchased and spent)
- RPL stake
- Smoothing pool status
- Withdrawal address
- Link to retrieve signature for signed terms of service. Maybe also other past instructions too.
- Summary of rewards earned (and/or link to more details)

In many cases these should also include links to edit and/or see more details
about the item.

Route: `/account`

Requires:
- Connected
- Registered
- Signed

### Credit Details

Show detailed history of user's payments and charges, in addition to the
overall account balance of Vrün days they hold.

Requires:
- Connected
- Registered
- Signed

### Validator Details

Show all kinds of information about a particular validator. Including:
- Status, and any related dates and timeouts until next action
- Graffiti
- Fee recipient (or show if managed automatically by Vrün)
- Pubkey
- Vrün index
- beacon chain index
- Whether it's a Rocket Pool validator
- Summary of charges (Vrün days spent) for this validator

As with the Account page, some of these may include links to edit the item.

Requires:
- Connected
- Registered
- Signed

### Set Graffiti

Set the graffiti for an individual validator.

Requires:
- Connected
- Registered
- Signed

### Set Fee Recipient

Set the fee recipient for an individual validator.

Requires:
- Connected
- Registered
- Signed

### (Presigned) Exit

Get a presigned exit message for an individual validator.
And/or submit an exit message to start exiting a validator from the beacon chain.

Requires:
- Connected
- Registered
- Signed

### Disable/Re-enable Validator

Disable a validator with Vrün, acknowledging that Vrün will therefore no longer run that validator.
Also possibly an option (maybe hidden?) to re-enable, but with lots of warnings about the risks.

Requires:
- Connected
- Registered
- Signed

### Export (not available currently)

Request validator pubkey from Vrün for migration to another service.

Requires:
- Connected
- Registered
- Signed

### Admin Add Credit

Submit Vrün request to credit an account with validator days for a special
reason (like a promotion or a refund).

Route: `/admin`

Requires:
- Connected
- Admin

## Shared Custom Hooks/Components/Utilities

### Send Transaction

### Sign Typed Message

### Submit to Vrün API
