'''
Loading necessary python libraries
'''
import json
import numpy as np
import random
from keras.utils import to_categorical
from keras import models
from keras.layers import Dense, Activation
from sklearn.preprocessing import MinMaxScaler

import tensorflowjs as tfjs

'''
returns loaded JSON arrays
'''
def read_json(filename):
	handle =open(filename)
	json_str=handle.read()
	json_tmp=json.loads(json_str)
	return json.loads(json_str)
'''
Loading experimental data
'''
data=list()
target=list()
data.append(read_json("calm.json"))
target.append(0)
data.append(read_json("exicited.json"))
target.append(1)
data.append(read_json("calm_2.json"))
target.append(0)
data.append(read_json("excited_2.json"))
target.append(1)
for i in range(0, len(data)):
	if len(data[i])<10:
		while(len(data[i])!=10):
			if random.randint(0,1):
				data[i].append(data[i][-1]+1)
			else:
				data[i].append(data[i][-1]-1)
	else:
		data[i]=data[i][1:11]
flag=0
'''
Additional simulated data based on distributition of experimental data
'''
for i in range(0, 100):
	data.append(list())
	if flag:
		target.append(1)
		flag=0
		mx=130
		mi=92
	else:
		target.append(0)
		flag=1
		mx=97
		mi=70
	start=random.randint(mi, mx-10)
	data[-1].append(start)
	while(len(data[-1])!=10):
		j=random.randint(0,2)
		if j==0 and data[-1][-1]!=mx:
			data[-1].append(data[-1][-1]+1)
		elif j==1:
			data[-1].append(data[-1][-1])
		else:
			if data[-1][-1]!=mi:
				data[-1].append(data[-1][-1]-1)
			else:
				data[-1].append(data[-1][-1]+1)
handle=open("heart_rate.csv","w")
for i in range(0,len(data)):
	handle.write(str(target[i]))
	for j in data[i]:
		handle.write(",")
		handle.write(str(j))
	handle.write('\n')
data=np.array(data)
print(len(data))
target=np.array(target)

'''
Building the sequential data
'''
model = models.Sequential()
model.add(Dense(32, activation='relu', input_dim=10))
model.add(Dense(1, activation='sigmoid'))
train_x=data[:80]
test_x=data[80:]
train_y=target[:80]
test_y=target[80:]
'''
Scaling data
'''
scalar = MinMaxScaler()
scalar.fit(data)
data = scalar.transform(data)
scales=scalar.scale_.tolist()
min_=scalar.min_.tolist()
'''
Saving scaler model to be scale test data
'''
with open('scales.json', 'w') as outfile:
    json.dump(scales, outfile)
with open('min_.json', 'w') as outfile:
    json.dump(min_, outfile)
    
 '''
 Compiling neural network
 '''
model.compile(
 optimizer = "rmsprop",
 loss = "binary_crossentropy",
 metrics = ["accuracy"]
)
'''
Training neural network
'''
model.fit(
 data, target, epochs=10, batch_size=10
)
'''
Saving model and converting it into json format
'''
model.save("model.h5")
tfjs.converters.save_keras_model(model, "tensorflow")
