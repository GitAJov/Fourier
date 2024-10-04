import cv2
import numpy as np

image_path = r'C:\Users\LENOVO\Downloads\pooh.jpg'
image = cv2.imread(image_path)

gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

edges = cv2.Canny(gray, threshold1=50, threshold2=150)

contours, _ = cv2.findContours(edges, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

coordinates = []
for contour in contours:
    for point in contour:
        x, y = point[0]
        coordinates.append({'x': float(x), 'y': float(y)})

for coord in coordinates:
    print(coord)
