# To add a new cell, type '# %%'
# To add a new markdown cell, type '# %% [markdown]'
# %% [markdown]
# # Data Classification and Inventory
# 
# ## Introduction
# 
# Read our introduction to the Elite Cars opportunity [here](./README.md)
# 
# Data Privacy is all about managing risk. Not all data has equal risk as discussed and different data should be treated differently.  We define 4 different categories of data.
# 
# | Category | Description | 
# | :------: | :---------- |
# | Restrictive| Data that can uniquely identify an individual or is highly sensitive if made public, such as healthcare data, or payment data |
# | Confidential | Data that can uniquely identify an individual when combined with other data |
# | Internal | Data that is freely available to internal employees and partners under NDA |
# | Public | Data that is freely shared outside the company with no risk of privacy breach | 
# 
# ## Data Categorization
# 
# Let us first categorize the driver data. Here is an example record
# 
# ``` json
# 
# {
#     "id": 1,
#     "gender": "M",
#     "name": "Vida Swift",
#     "ssn": "714-04-9653",
#     "email": "Vida.Swift58@hotmail.com",
#     "street": "6999 Malachi Ramp",
#     "city": "East Aaron",
#     "state": "NY",
#     "zipcode": 6390,
#     "password": "HkVoqwopS4uSI9f",
#     "dob": "1968-11-21",
#     "bic": "PBIIKZA1",
#     "routing": "213024093",
#     "dlstate": "WI",
#     "dlnumber": 691626583,
#     "dlscan": "vida.swift.dl.jpg",
#     "vin": "001H43U4U3S632152",
#     "licenceplate": "EJ41KQX"
# }
# ```
# %% [markdown]
# ### Question 1

# %%
import categoryExam
categoryExam.question1()


# %%



