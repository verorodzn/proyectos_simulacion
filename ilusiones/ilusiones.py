from tkinter import Tk, Canvas

window = Tk()
window.title("Ilusiones ópticas")
canvas = Canvas(window, width=800, height=600)

j, l, k = 210, 410, 610

for i in range(10,200,10):
    # Horizontal lines
    canvas.create_line(10, i, 200, i, fill="black", width=1)

    # Vertical lines
    canvas.create_line(j + i, 10, j+i, 200, fill="black", width=1)

    # Horizontal and Vertical lines
    canvas.create_line(420,i,600,i, fill="black",width=1)
    canvas.create_line(l+i,10,l+i,200, fill="black",width=1)

    # Arch
    canvas.create_line(k+i, 10, 800, i, fill="black", width=0.5)

canvas.pack()
window.mainloop()