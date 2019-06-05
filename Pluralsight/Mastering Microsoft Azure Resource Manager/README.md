This folder contains code and notes around the following course: https://app.pluralsight.com/library/courses/microsoft-azure-resource-manager-mastering

# Notes/Thoughts

* Chef vs Powershell Desired State Configuration?

**Finding resource providers for a subscription**

```
Connect-AzureRmAccount
Get-AzureRmResourceProvider | Select-Object ProviderNamespace, ResourceTypes | Sort-Object ProviderNamespace
```

## VM Deployment Items

* Resource Group
* Subnet Config
* Vnet
* Storage account
    * Standard_LRS <-- cheapest
* VM
* VM Configuration PS