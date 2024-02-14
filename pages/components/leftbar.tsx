import React from 'react'


const Leftbar = () => {
  return (
    <div className="flex-3 h-[calc(100vh-50px)] overflow-y-scroll sticky top-16 p-5" id="rocker">

<div className="sidebarWrapper">
                <ul className="sidebarList">
                    <li className="sidebarListItem">
                        {/*<RssFeedIcon className="sidebarIcon" />*/}
                        <span className="sidebarListItemText">Feed</span>
                    </li>
                    <li className="sidebarListItem">
                    
                        <span className="sidebarListItemText">Quizzes</span>
                    </li>
                    <li className="sidebarListItem">
                        
                        <span className="sidebarListItemText">Rating & Analytics</span>
                    </li>
                    <li className="sidebarListItem">
                        
                        <span className="sidebarListItemText">Forums</span>
                    </li>
                    <li className="sidebarListItem">
                        
                        <span className="sidebarListItemText">Groups</span>
                    </li>
                    <li className="sidebarListItem">
                        
                        <span className="sidebarListItemText">Videos</span>
                    </li>
                    <li className="sidebarListItem">
                       
                        <span className="sidebarListItemText">Questions</span>
                    </li>
                    <li className="sidebarListItem">
                      
                        <span className="sidebarListItemText">Jobs</span>
                    </li>
                    <li className="sidebarListItem">
                    
                        <span className="sidebarListItemText">Events</span>
                    </li>
                    <li className="sidebarListItem">
                     
                        <span className="sidebarListItemText">Courses</span>
                    </li>
                </ul>
                <button className="sidebarButton">
                    Show More
                </button>
                <hr className="sidebarHr" />
                <ul className="sidebarFriendList">
                <li className="sidebarListItem">
                        
                        <span className="sidebarListItemText">Videos</span>
                    </li>
                    <li className="sidebarListItem">
                       
                        <span className="sidebarListItemText">Questions</span>
                    </li>
                    <li className="sidebarListItem">
                      
                        <span className="sidebarListItemText">Jobs</span>
                    </li>
                    <li className="sidebarListItem">
                    
                        <span className="sidebarListItemText">Events</span>
                    </li>
                    <li className="sidebarListItem">
                     
                        <span className="sidebarListItemText">Courses</span>
                    </li>
               
                </ul>
            </div>
 
</div>
  )
}

export default Leftbar