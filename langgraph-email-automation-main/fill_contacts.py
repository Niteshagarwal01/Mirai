import pandas as pd

data = {
	'company_name': [f'Company{i+1}' for i in range(100)],
	'contact_person': [f'Person{i+1}' for i in range(100)],
	'role': ['Marketing Director'] * 100,
	'email': ['musicniteshagarwal@gmail.com'] * 100,
	'industry': ['Technology'] * 100,
	'company_size': ['50-100'] * 100
}

df = pd.DataFrame(data)
df.to_excel('marketing_contacts_template.xlsx', index=False)
print("Excel file created with 100 test contacts in correct format.")