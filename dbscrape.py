
#requires BeautifulSoup4, requests, and mysql/connector packages to run
from bs4 import BeautifulSoup
import requests
import mysql.connector

r = requests.get("https://apps.concord.edu/schedules/seatstaken.php")

soup = BeautifulSoup(r.text, "html.parser")

connection = mysql.connector.connect(user='', host='', port='', password = '',database='')
cursor = connection.cursor()
delete_course = ("DELETE FROM courses ")
cursor.execute(delete_course)
tables = soup.findAll("table", id="classtable")

for table in tables:

    for row in table.findAll("tr"):
        cells = row.findAll("td")

        if len(cells) > 0:

            if cells[0].get_text() != "CRN":

                crn         = cells[0].get_text()
                subject     = cells[1].get_text()
                crs         = cells[2].get_text()
                section     = cells[3].get_text()
                title       = cells[4].get_text()
                ch          = cells[5].get_text()
                maxSeats    = cells[6].get_text()
                enrolled    = cells[7].get_text()
                available   = cells[8].get_text()
                wl          = cells[9].get_text()
                days        = cells[10].get_text()
                stime       = cells[11].get_text()
                etime       = cells[12].get_text()

                buildingRoom = cells[13].get_text().split()
                building = buildingRoom[0]
                room    = buildingRoom[1].replace("(", "").replace(")", "")

                wk          = cells[14].get_text()
                instructor  = cells[15].get_text()
                ef          = cells[16].get_text()
                startDate   = cells[17].get_text()

                
                add_course = ("INSERT INTO courses "
                "(CRN, Subject, CRS, Section, Title, CH, MaxSeats, Enrolled, AvailableSeats, WL, "
                "Days, STIME, ETIME, Building, Room, WK, Instructor, EF, StartDate) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")

                course_values = (crn, subject, crs, section, title, ch, maxSeats, enrolled, available, wl, days, stime, etime, building, room, wk, instructor, ef, startDate)
               
                cursor.execute(add_course, course_values)

                print("Added {0:7} {1:7} {2:30} {3:10}".format(crn, subject, title, instructor))


connection.commit()
cursor.close()
connection.close()
